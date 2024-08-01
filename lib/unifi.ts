import axios, { AxiosInstance, AxiosError } from "axios";
import https from "https";

class UniFiController {
  private axiosInstance: AxiosInstance;
  private site: string;

  constructor(baseURL: string, site: string = "Sevid") {
    this.site = site;
    this.axiosInstance = axios.create({
      baseURL,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Only for testing
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async login(): Promise<void> {
    try {
      console.log("Attempting to login...");
      const response = await this.axiosInstance.post("/api/login", {
        username: process.env.UNIFI_USERNAME,
        password: process.env.UNIFI_PASSWORD,
        rememberMe: true,
      });

      console.log("Login response status:", response.status);
      console.log("Login response data:", response.data);

      if (response.headers["set-cookie"]) {
        const cookies = response.headers["set-cookie"];
        this.axiosInstance.defaults.headers.common["Cookie"] =
          cookies.join("; ");
      }

      // Check if login was successful
      if (
        response.data &&
        response.data.meta &&
        response.data.meta.rc === "ok"
      ) {
        console.log("Login successful");
      } else {
        throw new Error("Login failed: Unexpected response format");
      }
    } catch (error) {
      this.logError("Login failed", error);
      throw error;
    }
  }

  async createToken(expireTime: number, note: string): Promise<string> {
    try {
      await this.login(); // Ensure we're logged in before each request

      console.log("Attempting to create token...");
      console.log("Site:", this.site);

      const response = await this.axiosInstance.post(
        `/api/s/${this.site}/cmd/hotspot`,
        {
          cmd: "create-voucher",
          expire: expireTime,
          n: 1,
          note: note,
        }
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {

        return response.data.data[0];
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      this.logError("Create token failed", error);
      throw error;
    }
  }

  async getVoucherCode(): Promise<string> {
    try {
      await this.login(); // Ensure we're logged in before each request

      console.log("Attempting to get voucher code...");

      const response = await this.axiosInstance.get(
        `/api/s/${this.site}/stat/voucher/`
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data[0] &&
        response.data.data[0].code
      ) {
        //console.log("Voucher code:", response.data);
        return response.data.data[0];
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      this.logError("Get voucher code failed", error);
      throw error;
    }
  }

  private logError(message: string, error: unknown): void {
    if (axios.isAxiosError(error)) {
      console.error(`${message}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    } else {
      console.error(`${message}:`, error);
    }
  }
}

export const unifiController = new UniFiController(
  process.env.UNIFI_CONTROLLER_URL!,
  process.env.UNIFI_SITE! || "default" // or your site name if different
);
