import { TILE_DESTROY_EFFECT_NODE_NAME } from "../../core/constants/BoardViewConstants";
import { TILE_DESTROY_EFFECT_LIFETIME } from "../../core/constants/TileAnimationConstants";

export class DestroyEffectPlayer {
    private _owner: cc.Component;
    private _root: cc.Node;
    private _prefab: cc.Prefab;

    public constructor(owner: cc.Component, root: cc.Node, prefab: cc.Prefab) {
        this._owner = owner;
        this._root = root;
        this._prefab = prefab;
    }

    public play(position: cc.Vec3): void {
        if (!this._prefab)
            return;

        var effectNode: cc.Node = cc.instantiate(this._prefab);

        effectNode.name = TILE_DESTROY_EFFECT_NODE_NAME;
        effectNode.setPosition(position);
        this._root.addChild(effectNode);

        var particleSystem = effectNode.getComponent(cc.ParticleSystem);

        if (particleSystem)
            particleSystem.resetSystem();

        this._owner.scheduleOnce(() => {
            this.remove(effectNode);
        }, TILE_DESTROY_EFFECT_LIFETIME);
    }

    private remove(effectNode: cc.Node): void {
        if (!cc.isValid(effectNode))
            return;

        effectNode.removeFromParent(false);
    }
}