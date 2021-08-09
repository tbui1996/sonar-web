# S3 Bucket
resource "aws_s3_bucket" "web" {
  bucket = var.domain_name
  acl    = "private"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# Bucket Policy
resource "aws_s3_bucket_policy" "web_cdn_policy" {
  bucket = aws_s3_bucket.web.id

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "PolicyForCloudFrontPrivateContent"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS : aws_cloudfront_origin_access_identity.web_cdn_access_identity.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.web.arn}/*",
      },
    ]
  })
}

# Upload Build Files to Bucket
resource "aws_s3_bucket_object" "web_s3_bucket_object" {
  bucket       = aws_s3_bucket.web.id
  for_each     = fileset("${path.root}/../build", "**/*")
  key          = each.value
  source       = "${path.root}/../build/${each.value}"
  etag         = filemd5("${path.root}/../build/${each.value}")
  content_type = each.value == "_redirects" ? "text/plain" : lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
}
