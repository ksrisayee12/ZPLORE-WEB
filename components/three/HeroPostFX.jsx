'use client'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'

/**
 * HeroPostFX — Post-processing pipeline for the hero scene.
 * 
 * - Bloom: Soft HDR glow on white text, half-resolution for performance
 * - Vignette: Cinematic edge darkening  
 * - Noise: Extremely subtle film grain
 */
export default function HeroPostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
        kernelSize={KernelSize.LARGE}
        resolutionScale={0.5}
      />
      <Vignette
        offset={0.3}
        darkness={0.65}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.15}
      />
    </EffectComposer>
  )
}
