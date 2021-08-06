resource "aws_cloudfront_origin_access_identity" "web_cdn_access_identity" {
  comment = "For use with S3 bucket policy to allow for verification that the CloudFront origin requestion bucket resource is valid"
}

resource "aws_cloudfront_distribution" "cdn" {
  depends_on = [aws_acm_certificate.web]
  origin {
    domain_name = aws_s3_bucket.web.bucket_regional_domain_name
    origin_id   = var.domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.web_cdn_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for Sonar Internal Web App"
  default_root_object = "index.html"

  aliases = [var.domain_name]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.domain_name

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  tags = {
    Environment = var.environment
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.web.arn
    cloudfront_default_certificate = true
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.1_2016"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
}
