import React, { useContext } from "react";
import "./Chat.css";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Messages from "./../messages/Messages.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import Input from "./../input/Input.jsx";
import { ChatContext } from "../../context/ChatContext.js";

function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatInfocont">
          {/* /* This code snippet is conditionally rendering an image and a Typography component based on
          the existence of `data.user.photoURL` and `data.user.displayName`.  */}
          {data.user?.photoURL && <img src={data.user.photoURL} alt="" />}

          {data.user?.displayName && (
            <Typography variant="h5">{data.user.displayName}</Typography>
          )}
        </div>
        {data.user?.displayName && data.user?.photoURL && (
          <Tooltip
            TransitionComponent={Zoom}
            title="These Buttons are Dummy and These are Here for Decoration"
            arrow
          >
            <div className="chatIcons">
              <IconButton>
                <VideoCallIcon />
              </IconButton>
              <IconButton>
                <PhoneIcon />
              </IconButton>
              <IconButton>
                <GroupAddIcon />
              </IconButton>
              <IconButton>
                <MoreHorizIcon />
              </IconButton>
            </div>
          </Tooltip>
        )}
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default Chat;
