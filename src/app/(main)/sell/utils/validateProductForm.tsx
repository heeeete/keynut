import { OpenModal } from '@/type/modal';
import { UploadImagesProps } from '../_type/uploadImagesProps';
import { EditUploadImagesProps } from '../../shop/product/[id]/edit/_type/editUploadImagesProps';

const validateProductForm = async (
  uploadImages: UploadImagesProps | EditUploadImagesProps,
  title: string,
  mainCategory: number,
  subCategory: number,
  price: string,
  condition: number,
  description: string,
  openChatUrl: string,
  isValidOpenChat: boolean,
  openModal: OpenModal,
) => {
  if (
    !uploadImages.imageUrls.length ||
    !title.trim().length ||
    !mainCategory ||
    (mainCategory !== 9 && !subCategory) ||
    !price.length ||
    !condition ||
    !description.trim().length ||
    !isValidOpenChat
  ) {
    openModal({
      message: `필수 항목을 입력해주세요.`,
    });
    return false;
  } else if (!openChatUrl) {
    const result = await openModal({
      message: `오픈 채팅방 주소가 없습니다.\n계속 진행하시겠습니까?`,
      subMessage: '오픈 채팅방 주소를 입력하지 않으면, 상품에 대한 문의 및 대화를 위해 다른 수단을 제공해야 합니다.',
      isSelect: true,
      size: 'w-80',
    });
    if (!result) return false;
  }
  return true;
};

export default validateProductForm;
