/**
 * @jest-environment node
 */

import {
  getPlatformDetails,
  getAllCommonModels,
  getCommonModelTypes,
  getManyCommonModelTypes,
  getUniqueModelTypes,
} from "../integrationos"; // Replace with the actual file name
import { config } from "dotenv";
import { resolve } from "path";

describe("getConnectionKeys Integration Test", () => {
  // load .env file
  config({ path: resolve(__dirname, ".env.local") });

  it("Testing actions", async () => {
    // To test this scenario, you might need to manipulate the authentication state
    // This depends on how your authentication is implemented
    // For example, you might clear a session token or manipulate a database

    // const data = await getPlatformDetails("shopify", "Products");

    // const typesTs = await getCommonModelTypes('Accounts', 'typescript');
    // const typesRust = await getCommonModelTypes('Accounts', 'rust');

    const modelsType = await getUniqueModelTypes(["customers"], "rust");

    console.log(modelsType, ">>> modelsType");

    // console.log(typesTs.length, typesRust.length, ">>> delta", typesTs.length - typesRust.length);
  });

  it("converts data", async () => {
    type JsonObject = { [key: string]: any };

    function jsonToCustomFormat(jsonArray: JsonObject[]): string {
      const delimiter = "|";
      const newline = "\n";

      // Helper function to flatten JSON objects
      function flattenObject(
        obj: JsonObject,
        parentKey = "",
        res: JsonObject = {}
      ): JsonObject {
        for (let key in obj) {
          const propName = parentKey ? `${parentKey}.${key}` : key;
          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            flattenObject(obj[key], propName, res);
          } else {
            res[propName] = obj[key];
          }
        }
        return res;
      }

      // Flatten all JSON objects in the array
      const flattenedArray = jsonArray.map((obj) => flattenObject(obj));

      // Extract headers
      const headers = Array.from(
        new Set(flattenedArray.flatMap((obj) => Object.keys(obj)))
      );

      // Convert JSON to custom format
      const rows = flattenedArray.map((obj) => {
        return headers
          .map((header) => {
            const value = obj[header];
            if (Array.isArray(value)) {
              return value.join(";"); // Use semicolon to separate array values
            }
            return value !== undefined ? value : "";
          })
          .join(delimiter);
      });

      // Combine headers and rows
      const result = [headers.join(delimiter), ...rows].join(newline);
      return result;
    }

    // Example usage
    const jsonArray = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        address: {
          street: "123 Main St",
          city: "Anytown",
        },
        socialProfiles: ["twitter.com/johndoe", "linkedin.com/in/johndoe"],
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "098-765-4321",
        address: {
          street: "456 Elm St",
          city: "Othertown",
        },
        socialProfiles: ["twitter.com/janesmith"],
      },
    ];

    const customFormat = jsonToCustomFormat(jsonArray);
    console.log(customFormat);
  });
});
