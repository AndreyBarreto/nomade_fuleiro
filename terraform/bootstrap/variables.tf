variable "project_name" {
  description = "Project name used in default tags"
  type        = string
  default     = "nomade-fuleiro"
}

variable "environment" {
  description = "Environment label for backend resources"
  type        = string
  default     = "shared"
}

variable "aws_region" {
  description = "AWS region for the backend resources"
  type        = string
  default     = "us-east-1"
}

variable "state_bucket_name" {
  description = "Globally unique S3 bucket name for Terraform state"
  type        = string
  default     = "nomade-fuleiro-terraform-state"
}

variable "lock_table_name" {
  description = "DynamoDB table name used for state locking"
  type        = string
  default     = "nomade-fuleiro-terraform-lock"
}
