import path from "path";
export class UploadConstants {
  public static readonly UPLOAD_DIR = "uploads";
  public static readonly UPLOAD_PRODUCT_DIR = path.resolve(
    this.UPLOAD_DIR,
    "products",
  );
  public static readonly UPLOAD_URL_PREFIX = "/uploads/";
  public static readonly UPLOAD_PRODUCT_URL_PREFIX = path.resolve(this.UPLOAD_URL_PREFIX, "products")
}
