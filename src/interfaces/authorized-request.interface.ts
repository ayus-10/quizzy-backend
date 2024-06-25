import { Request } from "express";

export interface AuthorizedRequest extends Request {
  authorizedEmail?: string;
}
