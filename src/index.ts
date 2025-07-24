import fs from "fs";
import { formConfigurationSchema } from "./types/form-configuration";
import { handleForm } from "./browser";
import { safeJsonParse } from "./utils";

function run() {
  const CONFIGURATION_FILE_PATH =
    process.env.CONFIGURATION_FILE_PATH || "/tmp/configuration.json";

  console.log(
    `Loading at configuration file @ '${CONFIGURATION_FILE_PATH}'...`
  );

  fs.readFile(
    CONFIGURATION_FILE_PATH,
    {
      encoding: "utf-8",
    },
    (err, data) => {
      if (err) {
        console.log(err, "failed to read configuration file");
        process.exit(1);
      }

      const jsonParseResult = safeJsonParse(data);
      if (jsonParseResult.error) {
        console.log(
          jsonParseResult.error,
          "failed to parse configuration file"
        );
        process.exit(1);
      }

      if (!jsonParseResult.jsonData) {
        console.log("could not analyze configuration file");
        process.exit(1);
      }

      const configValidationResult = formConfigurationSchema.validate(
        jsonParseResult.jsonData
      );
      if (configValidationResult.error) {
        console.log(
          configValidationResult.error.message,
          "failed to validate form configuration data"
        );
        process.exit(1);
      }

      console.log("Successfully loaded configuration. Launching form...");

      handleForm(configValidationResult.value)
        .then(() => {
          console.log("successfully submitted form");
          process.exit(0);
        })
        .catch((err) => {
          console.log(err, "failed to comple form");
          process.exit(1);
        });
    }
  );
}

run();
