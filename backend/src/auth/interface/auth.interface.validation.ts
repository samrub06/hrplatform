import { UUIDTypes } from "uuid";

interface ValidationError {
  field: string;
  message: string;
}

interface UserLoginDTO {
  id: string;
  email: string;
  roleId: UUIDTypes;
  firstName: string;
  lastName: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export { UserLoginDTO, ValidationError, ValidationResult };

