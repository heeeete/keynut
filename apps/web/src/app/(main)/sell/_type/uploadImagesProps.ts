export interface UploadImagesProps {
  imageFiles: { file: File; width: number; height: number }[]; // 문자열과 숫자의 튜플 배열
  imageUrls: string[];
}

export interface UploadImagesHookProps {
  uploadImages: UploadImagesProps;
  setUploadImages: React.Dispatch<React.SetStateAction<UploadImagesProps>>;
}
