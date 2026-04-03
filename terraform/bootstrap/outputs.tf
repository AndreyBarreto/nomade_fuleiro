output "state_bucket_name" {
  description = "S3 bucket that stores Terraform state"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "lock_table_name" {
  description = "DynamoDB table used for Terraform state locking"
  value       = aws_dynamodb_table.terraform_lock.name
}
