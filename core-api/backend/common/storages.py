from storages.backends.s3boto3 import S3Boto3Storage
import os
from tempfile import SpooledTemporaryFile

S3_BUCKET = os.getenv("S3_BUCKET")


class BugFixedS3Boto3Storage(S3Boto3Storage):
    # boto3 bug workaround:
    # https://github.com/antropoloops/django-backend/commit/70150838e7e04b677a0097eafcd0d9e0bc0477ac
    def _save(self, name, content):
        """
        We create a clone of the content file as when this is passed to
        boto3 it wrongly closes the file upon upload where as the storage
        backend expects it to still be open
        """
        # Seek our content back to the start
        content.seek(0, os.SEEK_SET)

        # Create a temporary file that will write to disk after a specified
        # size. This file will be automatically deleted when closed by
        # boto3 or after exiting the `with` statement if the boto3 is fixed
        with SpooledTemporaryFile() as content_autoclose:

            # Write our original content into our copy that will be closed by boto3
            content_autoclose.write(content.read())

            # Upload the object which will auto close the
            # content_autoclose instance
            return super(BugFixedS3Boto3Storage, self)._save(name, content_autoclose)


class StaticStorage(BugFixedS3Boto3Storage):
    bucket_name = S3_BUCKET
    location = "static/"
    default_acl = "public-read"


class PublicMediaStorage(BugFixedS3Boto3Storage):
    bucket_name = S3_BUCKET
    location = "media/"
    default_acl = "public-read"
    file_overwrite = False
