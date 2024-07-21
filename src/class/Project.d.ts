/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 */

import { Sprite } from './Sprite'

export interface Project {
    targets: Sprite[],
    monitors: [], // TODO: Implement "monitors".
    meta: {
        semver: "3.0.0",
        vm: "0.2.0",
        agent: string,
        platform: {
            name: string,
            url: string
        }
    }
}