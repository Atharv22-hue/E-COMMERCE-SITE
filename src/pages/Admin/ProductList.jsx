import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState(null); // store file or path
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const [uploadProductImage, { isLoading: uploading }] =
    useUploadProductImageMutation();

  const [createProduct, { isLoading: creating }] =
    useCreateProductMutation();

  const { data: categories = [], isLoading: loadingCategories } =
    useFetchCategoriesQuery();

  // ✅ SUBMIT HANDLER (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      return toast.error("Please select a category");
    }

    try {
      const productData = new FormData();

      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", Number(price));
      productData.append("category", category);
      productData.append("quantity", Number(quantity));
      productData.append("brand", brand);
      productData.append("countInStock", Number(stock));

      // if backend expects image path (after upload)
      if (image) {
        productData.append("image", image);
      }

      const res = await createProduct(productData).unwrap();

      toast.success(`${res.name} created successfully`);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Product creation failed");
    }
  };

  // ✅ IMAGE UPLOAD HANDLER (FIXED)
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();

      toast.success("Image uploaded");
      setImage(res.image);      // backend returns path
      setImageUrl(res.image);   // preview
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Image upload failed");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />

        <div className="md:w-3/4 p-3">
          <h2 className="h-12 text-xl font-bold">Create Product</h2>

          {/* IMAGE PREVIEW */}
          {imageUrl && (
            <div className="text-center mb-3">
              <img
                src={imageUrl}
                alt="product"
                className="mx-auto max-h-[200px]"
              />
            </div>
          )}

          {/* FILE INPUT */}
          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-6">
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Name"
                className="p-3 w-[30rem] border rounded bg-[#101011] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price"
                className="p-3 w-[30rem] border rounded bg-[#101011] text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              <input
                type="number"
                placeholder="Quantity"
                className="p-3 w-[30rem] border rounded bg-[#101011] text-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <input
                type="text"
                placeholder="Brand"
                className="p-3 w-[30rem] border rounded bg-[#101011] text-white"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Description"
              className="p-3 mt-3 w-[95%] border rounded bg-[#101011] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-between mt-3">
              <input
                type="number"
                placeholder="Stock"
                className="p-3 w-[30rem] border rounded bg-[#101011] text-white"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />

              <select
                className="p-3 w-[30rem] border rounded bg-[#101011] text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {loadingCategories ? (
                  <option>Loading...</option>
                ) : (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="py-3 px-8 mt-5 rounded-lg text-lg font-bold bg-pink-600"
            >
              {creating ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;