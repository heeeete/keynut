import { useEffect } from 'react';

const useValidateAndRemoveDraft = () => {
  useEffect(() => {
    return () => {
      const draft = JSON.parse(sessionStorage.getItem('draft') || '');
      if (
        draft &&
        !draft.title &&
        !draft.description &&
        !draft.price &&
        (!draft.tags || !draft.tags.length)
      ) {
        sessionStorage.removeItem('draft');
      }
    };
  }, []);
};

export default useValidateAndRemoveDraft;
