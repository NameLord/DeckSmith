function buildMod(
  name: string,
  id: string,
  version: string,
  cardClasses: string[],
) {
  return `
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using BepInEx;
using BepInEx.Configuration;
using HarmonyLib;
using UnboundLib;
using UnboundLib.Cards;
using RarityLib.Utils;
using UnboundLib.Utils;
using UnboundLib.Utils.UI;
using UnboundLib.GameModes;
using UnboundLib.Networking;
using ModsPlus;

[BepInDependency("com.willis.rounds.unbound")]
[BepInDependency("com.willis.rounds.modsplus")]
[BepInDependency("root.rarity.lib")]
[BepInPlugin(ModId, ModName, ModVersion)]
[BepInProcess("Rounds.exe")]
public class ${name}Plugin : BaseUnityPlugin
{
    private const string ModId = "${id}";
    private const string ModName = "${name}";
    private const string ModVersion = "${version}";
    private const string CompatabilityModName = "${name}";

    void Awake()
    {
${cardClasses
  .map((c) => `        CardRegistry.RegisterCard<${c}>();`)
  .join('\n')}
      RarityLib.Utils.RarityUtils.AddRarity("Exordium", 0.003f, new Color32(199, 209, 130, 0), new Color32(0, 199, 209, 0));
    }

    void Start()
    {
        var harmony = new Harmony(ModId);
        harmony.PatchAll();
    }
}`.trim();
}

export default buildMod;
