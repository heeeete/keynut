export interface EditUploadImagesProps {
  imageFiles: { name?: string; file?: File; width: number; height: number }[]; // 문자열과 숫자의 튜플 배열
  imageUrls: string[];
}

export interface EditUploadImagesHookProps {
  uploadImages: EditUploadImagesProps;
  setUploadImages: React.Dispatch<React.SetStateAction<EditUploadImagesProps>>;
  setDeleteImages: React.Dispatch<React.SetStateAction<string[]>>;
}
