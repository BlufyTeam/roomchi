import { z } from "zod";

export const activeDirectoryConfigSchema = z.object({
  domainName: z.string(),
  domainController: z.string(),
  loginName: z.string(),
  password: z.string(),
});
