export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    role: string;
  };
}
