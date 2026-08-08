import Phaser from 'phaser'

export type MusicTrack = 'town-hub' | 'interior-cu' | 'interior-department'

const TRACKS: Record<MusicTrack, string> = {
  'town-hub': 'assets/audio/town-hub.mp3',
  'interior-cu': 'assets/audio/interior-cu.mp3',
  'interior-department': 'assets/audio/interior-department.mp3',
}

const VOLUME = 0.34

export function preloadMusic(scene: Phaser.Scene) {
  for (const [key, path] of Object.entries(TRACKS)) {
    if (!scene.cache.audio.exists(key)) scene.load.audio(key, path)
  }
}

export function playMusic(scene: Phaser.Scene, track: MusicTrack) {
  const current = scene.registry.get('bgmTrack') as MusicTrack | undefined
  if (current === track) return

  scene.sound.stopAll()
  if (!scene.cache.audio.exists(track)) return

  scene.sound.play(track, { loop: true, volume: VOLUME })
  scene.registry.set('bgmTrack', track)
}
