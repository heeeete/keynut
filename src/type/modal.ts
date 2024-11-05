interface OpenModalProps {
  message: string;
  subMessage?: string;
  isSelect?: boolean;
  size?: string;
}

export type OpenModal = (props: OpenModalProps) => Promise<boolean>;
