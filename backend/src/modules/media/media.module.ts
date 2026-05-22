import { Controller, Get, Injectable, Module, Query, UseGuards } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { AdminGuard } from "../admin/admin.module";

/**
 * Issues short-lived signatures for **signed** direct-to-Cloudinary uploads.
 * The browser uploads the file straight to Cloudinary using this signature, so
 * the API secret never leaves the server and large files never transit our API.
 *
 * Requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
 */
@Injectable()
export class MediaService {
  sign(folder: string) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
    const timestamp = Math.round(Date.now() / 1000);
    // Every param sent to Cloudinary (except file/api_key) must be in the signature.
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);
    return {
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    };
  }
}

@Controller("admin/cloudinary")
export class MediaController {
  constructor(private readonly svc: MediaService) {}

  // Admin-only: reuses the existing admin session token (Bearer).
  @UseGuards(AdminGuard)
  @Get("signature")
  signature(@Query("folder") folder?: string) {
    return this.svc.sign(folder || "lg-travels");
  }
}

@Module({
  controllers: [MediaController],
  providers: [MediaService, AdminGuard],
})
export class MediaModule {}
