terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "circulo"

    workspaces {
      name = "sonar-web"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Providers
provider "aws" {
  region = "us-east-1"
}

# Variables
variable "domain_name" {
  default = "sonar.circulo.dev"
}

variable "root_domain_name" {
  default = "circulo.dev"
}

# Bucket
resource "aws_s3_bucket" "web" {
  bucket = var.domain_name
  acl    = "public-read"
  
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Action": [
          "s3:GetObject"
      ],
      "Principal": "*",
      "Resource": "arn:aws:s3:::sonar.circulo.dev/*"
    }
  ]
}
EOF
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
  
}

# Certificate and Domain
resource "aws_acm_certificate" "web" {
  domain_name       = "sonar.circulo.dev"
  validation_method = "DNS"

  tags = {
    Name          = "sonar.circulo.dev"
    ProductDomain = "Sonar web"
    Environment   = "dev"
    Description   = "Certificate for sonar.circulo.dev"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_web" {
  certificate_arn         = aws_acm_certificate.web.arn
  validation_record_fqdns = [aws_route53_record.web_route53.fqdn]
}

resource "aws_route53_record" "web_route53" {
  zone_id = "Z0245196LCP8G3V46P5V"
  name    = var.domain_name
  type    = "A"
  
  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}



# CloudFront (cdn)
resource "aws_cloudfront_distribution" "cdn" {
  depends_on = [aws_acm_certificate.web]
  origin {
    domain_name = aws_s3_bucket.web.bucket_regional_domain_name
    origin_id   = "sonar.circulo.dev"
  }

  
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for Sonar web app"
  default_root_object = "index.html"

  aliases = ["sonar.circulo.dev"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "sonar.circulo.dev"
    
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
    Environment = "dev"
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.web.arn
    cloudfront_default_certificate = true
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.1_2016"
  }

  custom_error_response {
    error_code    = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
}
