import {
  useMutation,
  UseMutationOptions,
  UseMutationResult
} from 'react-query';
import axios from 'axios';

import axiosInstance from '../../../utils/axios';
import type {
  FileTypeResponse,
  FileUploadResponse,
  PreSignedUrlResponse
} from '../../../@types/chat';

const useUploadFileToCloud = (
  options: UseMutationOptions<FileTypeResponse, Error, File> = {}
): UseMutationResult<FileTypeResponse, Error, File> =>
  useMutation<FileTypeResponse, Error, File>(async (file: File) => {
    const formData = new FormData();
    formData.append('file-upload', file, file.name);

    const s3PresignedUrl = await axiosInstance.get<PreSignedUrlResponse>(
      `/cloud/upload/url?filename=${file.name}`
    );

    if (s3PresignedUrl.status !== 200) {
      throw new Error(
        '[support/uploadFile]: failed to get presigned URL for file upload'
      );
    }

    const s3Upload = await axios.put(s3PresignedUrl.data.url!, file, {
      headers: {
        'Content-Type': [file.type],
        'x-amz-meta-filename': [file.name]
      }
    });

    if (s3Upload.status !== 200) {
      throw new Error('[support/uploadFile]: failed to upload file to S3');
    }

    const response = await axiosInstance.post<FileUploadResponse>(
      `/cloud/upload`,
      JSON.stringify({
        // null chat ID because chat doesn't exist in this scenario
        chatId: null,
        fileId: s3PresignedUrl.data.key,
        filename: file.name
      })
    );

    if (response.status !== 200) {
      throw new Error('[support/uploadFile]: failed to upload file');
    }

    return {
      databaseId: response.data.fileID,
      fileKey: s3PresignedUrl.data.key
    } as FileTypeResponse;
  }, options);

export default useUploadFileToCloud;
