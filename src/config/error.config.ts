

export const routeNotFound: string =
  "<div style='margin:0; padding:0; height:100vh;  font-size:5rem; display:flex; align-items:center; justify-content:center;'>Route Not Found</div>";

export enum ErrorCodes {
  CREATED = 201,  
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  NOT_FOUND = 404,
  AUTHENTICATION_FAILED = 401,
  CONFLICT = 409,
}
