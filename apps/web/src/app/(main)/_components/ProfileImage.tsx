import Image from 'next/image';

const ProfileImage = ({ image }: { image: string | null | undefined }) => {
  return (
    <>
      {image ? (
        <div className="flex rounded-full w-85 aspect-square relative justify-center items-center border ">
          <Image
            className="rounded-full object-cover"
            src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
            alt="profileImage"
            fill
            sizes="150px"
          />
        </div>
      ) : (
        <div className="w-85 aspect-square defualt-profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
            <path
              fill="rgba(0,0,0,0.2)"
              d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
