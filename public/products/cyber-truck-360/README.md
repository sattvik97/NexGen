# Cyber Truck 360° Frames

Drop **36 JPG/PNG photos** of the 1:18 Cyber Truck RC car here, taken at
evenly spaced angles (10° apart), in clockwise rotation order.

## Naming
```
frame-01.jpg
frame-02.jpg
...
frame-36.jpg
```
Zero-padded, all the same extension. The viewer in
`app/components/NexGenStory.tsx` expects exactly 36 frames; if you only
have 24, change `FRAME_COUNT` in that file to match.

## How to capture
1. Place the toy on a manual or motorized turntable on a clean backdrop.
2. Set the camera on a tripod.
3. Rotate 10° per shot. Lock exposure & white-balance so every frame
   matches.
4. Crop all images to the **same square framing**.
5. Resize to ~1200×1200 and export JPG at quality 80 (~70–150 KB each).

## Tips
- Total weight should be < 4 MB for the whole set so the section loads
  fast on mobile.
- Use a phone app like *Cycloramic* or *360 Photo* on iOS, or
  *Lit Photo* on Android, to automate angle stops.
- Until you add the frames, the section gracefully shows the existing
  Cyber Truck hero image with a small yellow notice.
