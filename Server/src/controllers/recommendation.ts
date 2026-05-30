import {asyncHandler} from "../utils/asyncHandler.js";
import {db} from "../db/db.js";
import {product} from "../models/product.js";
import {ApiError} from "../utils/ApiError.js";
import type {actionEnum} from "../types/type.js";
import {userActivity} from "../models/userActivity.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {and, desc, eq, inArray, notInArray, arrayOverlaps} from "drizzle-orm";
import {geminiModel} from "../utils/gemini.js";

export const trackActivity = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized")

    const {productId, actionType} = req.body as { productId: string, actionType: actionEnum }

    await db.insert(userActivity).values({
        userId: user.id,
        productId,
        actionType
    })

    res.json(new ApiResponse(200, null, "success"))
})


export const getRecommendations = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized");



    const activities = await db.select().from(userActivity)
        .where(eq(userActivity.userId, user.id))
        .orderBy(desc(userActivity.createdAt))
        .limit(10);
    const viewedProductIds = activities.map((a) => a.productId).filter((id): id is string => id !== null);

    if (viewedProductIds.length === 0) {
        const fallbackProducts = await db.select().from(product).where(eq(product.isActive, true)).limit(5);
        return res.json(new ApiResponse(200, fallbackProducts, "Fallback recommendations"));
    }

    const viewedProducts = await db.select({
        id: product.id,
        name: product.name,
        category: product.category,
    }).from(product).where(inArray(product.id, viewedProductIds));

    const userCategories = [...new Set(viewedProducts.flatMap(p => p.category || []))];

    if (userCategories.length === 0) {
        const fallbackProducts = await db.select().from(product).where(eq(product.isActive, true)).limit(5);
        return res.json(new ApiResponse(200, fallbackProducts, "Fallback recommendations"));
    }

    // Optimized: Fetch full objects so we skip the final DB query
    const candidateProducts = await db.select()
        .from(product)
        .where(and(arrayOverlaps(product.category, userCategories),eq(product.isActive, true), notInArray(product.id, viewedProductIds))
        )
        .limit(30);

    if (candidateProducts.length === 0) {
        return res.json(new ApiResponse(200, [], "No new recommendations available"));
    }

    // Optimized: Reduce token usage for Gemini by sending minimal payload
    const candidatePayload = candidateProducts.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.description ? p.description.substring(0, 100) : "",
        price: p.price
    }));

    const prompt = `
        You are an expert E-commerce AI recommendation engine.
        
        The user has recently interacted with these products:
        ${JSON.stringify(viewedProducts.map(p => ({ name: p.name, category: p.category })))}
        
        Based on their interest, select exactly 5 best products from the following candidate list that the user is most likely to buy next:
        ${JSON.stringify(candidatePayload)}
        
        Rules:
        - Return ONLY a valid JSON array of the 5 recommended product IDs.
        - Do not include markdown formatting like \`\`\`json. Just the raw array.
        - Example format: ["id1", "id2", "id3", "id4", "id5"]
    `;

    const result = await geminiModel(prompt);

    const cleanText = result?.replace(/```json|```/g, "").trim();

    let recommendedIds: string[] = [];
    try {
        recommendedIds = JSON.parse(cleanText!);
    } catch (error) {
        console.error("Gemini JSON Parse Error:", cleanText);
        throw new ApiError(500, "Failed to parse AI response");
    }
    
    if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
        return res.json(new ApiResponse(200, [], "No recommendations generated"));
    }

    // Optimized: No final DB query! Just filter candidates.
    const recommendations = candidateProducts.filter(p => recommendedIds.includes(p.id));

    return res.json(new ApiResponse(200, recommendations, "Recommendations fetched successfully"));
});