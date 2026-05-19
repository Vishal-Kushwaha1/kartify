import { Route, Routes } from "react-router-dom";
import { AddProduct } from "./AddProduct";
import { SingleProduct } from "./SingleProduct";
import { Products } from "./Products";
import { EditProduct } from "./EditProduct";

export const SellerRoutes = () => {
  return (
    <>
      <Routes>
        <Route index element={<Products />} />
        <Route path="add" element={<AddProduct />} />
        <Route path="product/:id" element={<SingleProduct />} />
        <Route path="product/:id/edit" element={<EditProduct />} />
      </Routes>
    </>
  );
};
