import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "@/utils/Axios.tsx";
import {LoadingPage} from "@/components/LoadingPage.tsx";
import type {Seller} from "@/types/type.ts";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const AdminSeller = () => {
    const {id} = useParams<{ id: string }>();
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const fetchSeller = useCallback(async () => {
            try {
                setLoading(true);
                const result = await api.get(`/admin/seller/${id}`,{withCredentials: true});
                setSeller(result.data.data || result.data);
            } catch (error) {
                console.error("Error fetching seller details:", error);
            } finally {
                setLoading(false);
            }
        },[id])
    useEffect(() => {
        if (id) {
            fetchSeller();
        }
    }, [id, fetchSeller]);

    const handleToggleBan = async () => {
        if (!seller) return;
        try {
            setIsProcessing(true);
            const action = seller.isActive ? "ban" : "unban";
            await api.put(`/admin/seller/${action}/${seller.id}`);
            setSeller({...seller, isActive: !seller.isActive});
            toast.success(`Seller successfully ${seller.isActive ? "banned" : "unbanned"}.`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update seller status.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerify = async () => {
        if (!seller) return;
        try {
            setIsProcessing(true);
            await api.put(`/admin/seller/${seller.id}`);
            setSeller({...seller, isVerified: true});
            toast.success("Seller successfully verified.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to verify seller.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <LoadingPage/>;
    if (!seller) return <div className="p-6 text-center">Seller not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
                    <p className="text-muted-foreground">Manage and view seller information</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={seller.isActive ? "default" : "destructive"}
                           className={seller.isActive ? "bg-green-500 hover:bg-green-600 uppercase" : "uppercase"}>
                        {seller.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={seller.isVerified ? "default" : "secondary"}
                           className={seller.isVerified ? "bg-blue-500 hover:bg-blue-600 uppercase" : "bg-primary/15 text-primary uppercase"}>
                        {seller.isVerified ? "Verified" : "Pending"}
                    </Badge>
                    <div className="ml-2 flex items-center gap-2 border-l pl-4">
                        {!seller.isVerified && (
                            <Button variant="default" size="sm" onClick={handleVerify} disabled={isProcessing}>Verify</Button>
                        )}
                        <Button
                            variant={seller.isActive ? "destructive" : "default"}
                            size="sm"
                            onClick={handleToggleBan}
                            disabled={isProcessing}
                        >
                            {seller.isActive ? "Ban" : "Unban"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Identity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {seller.shopImage ? (
                                <div className="aspect-video w-full overflow-hidden rounded-md border">
                                    <img src={seller.shopImage} alt="Shop" className="w-full h-full object-cover"/>
                                </div>
                            ) : (
                                <div
                                    className="aspect-video w-full rounded-md border border-dashed flex items-center justify-center bg-muted/50">
                                    <span className="text-muted-foreground">No shop image</span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{seller.storeName}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{seller.storeLocation || "No location provided"}</p>
                            </div>
                            <Separator/>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Seller ID</p>
                                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded-md mt-1">{seller.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Owner User ID</p>
                                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded-md mt-1">{seller.userId}</p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-sm text-muted-foreground">Registered
                                        on {new Date(seller.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>Details about the store and operations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                    <p className="text-sm leading-relaxed">{seller.storeDescription || "No description provided."}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Documents</CardTitle>
                            <CardDescription>Government issued identification and tax details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg border bg-muted/20">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">PAN Number</p>
                                        <p className="font-semibold tracking-wide">{seller.panNumber}</p>
                                    </div>
                                    <div className="p-4 rounded-lg border bg-muted/20">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Aadhar Number</p>
                                        <p className="font-semibold tracking-wide">{seller.aadharNumber}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg border bg-muted/20 h-full flex flex-col">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">GST Number</p>
                                        <p className="font-semibold tracking-wide mb-4">{seller.gstNumber}</p>
                                        {seller.gstCertificate ? (
                                            <>
                                                <a href={seller.gstCertificate} target="_blank" rel="noreferrer"
                                                   className="mt-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                                                    View GST Certificate
                                                </a>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic mt-auto">No certificate
                                                uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminSeller;