import React, { useEffect } from 'react';

const useAutoSaveDraft = (
  isInitialRender: React.MutableRefObject<boolean>,
  dependency: Record<string, any>,
) => {
  useEffect(() => {
    if (isInitialRender.current) return;
    sessionStorage.setItem('draft', JSON.stringify(dependency));
  }, [
    dependency.title,
    dependency.mainCategory,
    dependency.subCategory,
    dependency.condition,
    dependency.description,
    dependency.price,
    dependency.openChatUrl,
    dependency.tags,
  ]);
};

export default useAutoSaveDraft;
