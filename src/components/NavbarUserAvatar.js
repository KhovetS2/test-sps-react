import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import userService from "../services/UserService";

function NavbarUserAvatar({ currentUser }) {
  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    async function loadAvatar() {
      try {
        if (currentUser?.profile_image) {
          setAvatarSrc(currentUser.profile_image);
          return;
        }

        if (currentUser?.has_profile_image && currentUser?.id) {
          objectUrl = await userService.getProfileImageObjectUrl(
            currentUser.id,
          );
          setAvatarSrc(objectUrl);
        } else {
          setAvatarSrc(null);
        }
      } catch (error) {
        setAvatarSrc(null);
      }
    }

    loadAvatar();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentUser]);

  return <Avatar name={currentUser?.name} src={avatarSrc} />;
}

export default NavbarUserAvatar;
