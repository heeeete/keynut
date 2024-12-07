import { useEffect } from 'react';

const useValidateAndRemoveDraft = () => {
  useEffect(() => {
    return () => {
      const draft = sessionStorage.getItem('draft');
      if (!draft) return;
      const parseDraft = JSON.parse(draft);
      if (!parseDraft) return;
      if (
        parseDraft &&
        !parseDraft.title &&
        !parseDraft.description &&
        !parseDraft.price &&
        (!parseDraft.tags || !parseDraft.tags.length)
      ) {
        sessionStorage.removeItem('draft');
      }
    };
  }, []);
};

export default useValidateAndRemoveDraft;
