output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.site.bucket
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.site.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used for cache invalidation in the pipeline"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "Default CloudFront domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "Site URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "ci_deploy_access_key_id" {
  description = "AWS_ACCESS_KEY_ID for GitHub Actions — add as a repository secret"
  value       = aws_iam_access_key.ci_deploy.id
}

output "ci_deploy_secret_access_key" {
  description = "AWS_SECRET_ACCESS_KEY for GitHub Actions — add as a repository secret"
  value       = aws_iam_access_key.ci_deploy.secret
  # sensitive   = true
}
