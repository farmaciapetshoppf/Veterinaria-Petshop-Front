import { getAllProducts } from "../services/product.services";
import StoreClient from "./StoreClient";

export default async function Store() {
  const allProducts = await getAllProducts();
  
  return <StoreClient initialProducts={allProducts} />;
}