# IAM user for GitHub Actions deployments
resource "aws_iam_user" "ci_deploy" {
  name = "${var.project_name}-${var.environment}-ci-deploy"
}

resource "aws_iam_access_key" "ci_deploy" {
  user = aws_iam_user.ci_deploy.name
}

resource "aws_iam_user_policy" "ci_deploy" {
  name   = "${var.project_name}-${var.environment}-ci-deploy-policy"
  user   = aws_iam_user.ci_deploy.name
  policy = data.aws_iam_policy_document.ci_deploy.json
}

data "aws_iam_policy_document" "ci_deploy" {
  # S3 permissions: sync ./out/ to the bucket
  statement {
    sid    = "S3ListBucket"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
    ]
    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    sid    = "S3ManageObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:PutObjectAcl",
    ]
    resources = ["${aws_s3_bucket.site.arn}/*"]
  }

  # CloudFront permission: create invalidation
  statement {
    sid    = "CloudFrontInvalidation"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
      "cloudfront:ListInvalidations",
    ]
    resources = [aws_cloudfront_distribution.site.arn]
  }
}
