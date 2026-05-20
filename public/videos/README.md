# Hero video (Evening social card)

The site streams the **mixer close-up** clip from Pexels by default:

- **Asset:** [`9003937` — Yan Krukau](https://www.pexels.com/video/close-up-footage-of-a-person-using-sound-mixer-9003937/)

The CDN filename includes resolution details and can change. Code uses **`9003937-uhd_2560_1440_25fps.mp4`** taken from that page (see browser devtools → Network when downloading).

### Optional offline / self-hosted copy

```powershell
copy "C:\path\to\your-download.mp4" ".\public\videos\evening-social.mp4"
```

The `<video>` tries `/videos/evening-social.mp4` **after** the remote Pexels sources.
