variable "project_name" {
  description = "Project name"
  type        = string
  default     = "nomade-fuleiro"
}

variable "environment" {
  description = "Environment (prod, staging)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Custom domain (e.g. nomadefuleiro.com.br). Leave empty to use the default CloudFront domain."
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate in us-east-1 for the custom domain. Required if domain_name is set."
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class (PriceClass_100 = US/EU, PriceClass_200 = + South America, PriceClass_All = worldwide)"
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "price_class must be PriceClass_100, PriceClass_200, or PriceClass_All."
  }
}
