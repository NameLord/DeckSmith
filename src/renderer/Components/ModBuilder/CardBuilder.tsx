import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  Card,
  Button,
  EditableText,
  H1,
  H2,
  FormGroup,
  HTMLSelect,
  TextArea,
  NumericInput,
  Intent,
  OverlayToaster,
  ButtonGroup,
  Switch,
  Callout,
  InputGroup,
  Tooltip,
} from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { IconNames } from '@blueprintjs/icons';
import { useCallback, useState } from 'react';
import '../Flow.css';
import '../../Shared.css';
import buildCard, {
  CardColor,
  CardRarity,
  Stat,
  StatChange,
  CardProps,
  SimpleAmount,
  getStatInfo,
} from './Templates/CardTemplate';
import {
  atomOneDarkReasonable as dark,
  atomOneLight as light,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useSettings } from '../../SettingsProvider';
import { useModContext } from '../../ModContextProvider';
import { useNavigate, useParams } from 'react-router-dom';

function CardBuilder() {
  const navigate = useNavigate();
  let { index } = useParams();
  const cardIndex = parseInt(index);
  const { settings, updateSettings } = useSettings();
  const { modContext, updateModContext } = useModContext();
  const [name, setName] = useState(modContext.cards[cardIndex].cardName || '');
  const [description, setDescription] = useState(
    modContext.cards[cardIndex].cardDescription || '',
  );
  const [artUrl, setArtUrl] = useState(
    modContext.cards[cardIndex].cardArtUrl ||
      'https://placehold.co/512x402/png',
  );
  const [rarity, setRarity] = useState(
    modContext.cards[cardIndex].cardRarity || ('Common' as CardRarity),
  );
  const [color, setColor] = useState(
    modContext.cards[cardIndex].cardColor || ('TechWhite' as CardColor),
  );
  const [stats, setStats] = useState(
    modContext.cards[cardIndex].cardStats || ([] as StatChange[]),
  );

  const handleSetName = (value: string) => {
    if (/^[A-Za-z ]*$/.test(value)) {
      setName(value);
    }
  };

  const handleSetDescription = (value: string) => {
    if (/^[^\n]*$/.test(value)) {
      setDescription(value);
    }
  };

  const handleSetArtUrl = (url: string) => {
    setArtUrl(url);
  };

  const handleSetRarity = (value: CardRarity) => {
    setRarity(value);
  };

  const handleSetColor = (value: CardColor) => {
    setColor(value);
  };

  const handleStatChange = (
    index: number,
    stat: Stat,
    value: number,
    positive: boolean,
    simpleAmount: SimpleAmount,
  ) => {
    const newStats = [...stats];
    newStats[index] = {
      ...newStats[index],
      stat,
      value,
      positive,
      simpleAmount,
    };

    const statInfo = getStatInfo(stat);
    for (let i = 0; i < statInfo.requires.length; i++) {
      if (!newStats.map((s) => s.stat).includes(statInfo.requires[i])) {
        newStats.push({
          stat: statInfo.requires[i],
          value: 1,
          positive: true,
          simpleAmount: 'notAssigned',
        });
      }
    }

    setStats(newStats);
  };

  const addStat = () => {
    const newStats = [...stats];
    const statOptions: Stat[] = [
      'damage',
      'health',
      'reload',
      'ammo',
      'projectiles',
      'bursts',
      'timeBetweenBullets',
      'attackSpeed',
      'bounces',
      'bulletSpeed',
      'blocksamount',
      'blockhealamount',
      'blockcooldown',
      'respawns',
      'lifesteal',
      'numberofjumps',
      'slow',
      'movementspeed',
      'knockback',
      'gravity',
      'spread',
      'projectilesize',
      'ammoregeneration',
      'size',
      'armorHealth',
      'armorRegen',
      'regenCooldownSeconds',
      'reactivateAfterSeconds',
      'luck'
    ];
    const availableStatOptions = statOptions.filter(
      (o) => !stats.map((s) => s.stat).includes(o),
    );

    if (availableStatOptions.length == 0) return;

    newStats.push({
      stat: availableStatOptions[0],
      value: 1,
      positive: true,
      simpleAmount: 'notAssigned',
    });
    setStats(newStats);
  };

  const removeStat = (index: number) => {
    const indexesToRemove = [index];
    const statChange = stats[index];
    for (let i = 0; i < stats.length; i++) {
      const otherStatInfo = getStatInfo(stats[i].stat);
      if (
        otherStatInfo.requires.includes(statChange.stat) ||
        statChange.stat === stats[i].stat
      ) {
        indexesToRemove.push(i);
      }
    }

    const newStats = stats.filter((_, i) => !indexesToRemove.includes(i));
    setStats(newStats);
  };

  const saveCard = () => {
    if (isValid()) {
      const newCards = [...modContext.cards];
      newCards[cardIndex] = {
        ...newCards[cardIndex],
        cardArtUrl: artUrl,
        cardName: name,
        cardDescription: description,
        cardRarity: rarity,
        cardColor: color,
        cardStats: stats,
      };
      const newModContext = { ...modContext };
      newModContext.cards = newCards;
      updateModContext(newModContext);
      navigate('/');
    } else {
      deleteSelf();
    }
  };

  function isValid() {
    if (name == null || name == '') return false;
    if (description == null || description == '') return false;
    if (stats == null || stats.length == 0) return false;
    if (artUrl == null || artUrl == '') return false;

    // assert that there are no duplicate stats
    const distinctSet = new Set(stats.map((s) => s.stat));
    if (distinctSet.size !== stats.length) return false;

    return true;
  }

  function deleteSelf() {
    const newCards = modContext.cards.filter((_, i) => i !== cardIndex);
    const newModContext = { ...modContext, cards: newCards };
    updateModContext(newModContext);
    navigate('/');
  }

  function getCardScript() {
    return buildCard(modContext.modName, {
      cardName: name,
      cardDescription: description,
      cardArtUrl: artUrl,
      cardRarity: rarity,
      cardColor: color,
      cardStats: stats,
    });
  }

  function copyCardScript() {
    navigator.clipboard.writeText(getCardScript());
    const toast = OverlayToaster.create({
      position: 'bottom',
      usePortal: true,
    });
    toast.show({
      message: 'Copied script!',
      intent: Intent.SUCCESS,
      icon: IconNames.CLIPBOARD,
      timeout: 3000,
    });
  }

  function statView(index: number, stat: StatChange) {
    const statInfo = getStatInfo(stat.stat);
    const isDuplicate = stats.filter((s) => s.stat === stat.stat).length > 1;
    const statOptions: Stat[] = [
      'damage',
      'health',
      'reload',
      'ammo',
      'projectiles',
      'bursts',
      'timeBetweenBullets',
      'attackSpeed',
      'bounces',
      'bulletSpeed',
      'blocksamount',
      'blockhealamount',
      'blockcooldown',
      'respawns',
      'lifesteal',
      'numberofjumps',
      'slow',
      'movementspeed',
      'knockback',
      'gravity',
      'spread',
      'projectilesize',
      'ammoregeneration',
      'size',
      'armorHealth', // Armor Stat Below
      'armorRegen',
      'regenCooldownSeconds',
      'reactivateAfterSeconds',
      'luck'
    ];
    const availableStatOptions = statOptions.filter(
      (o) => o === stat.stat || !stats.map((s) => s.stat).includes(o),
    );
    return (
      <Card style={{ marginTop: '1em' }}>
        {isDuplicate ? (
          <Callout
            icon={IconNames.WARNING_SIGN}
            intent={Intent.WARNING}
            title={`Cannot have duplicate '${stat.stat}' stats!`}
          />
        ) : null}
        <FormGroup label="Stat">
          <HTMLSelect
            fill={true}
            options={availableStatOptions}
            value={stat.stat}
            onChange={(e) =>
              handleStatChange(
                index,
                e.target.value as Stat,
                stat.value,
                stat.positive,
                stat.simpleAmount,
              )
            }
          />
        </FormGroup>
        <FormGroup
          label={`Value ${
            statInfo.additive ? '(Additive)' : '(Multiplier)'
          } ${statInfo.unit.trim()} `}
        >
          <NumericInput
            fill={true}
            value={Math.min(statInfo.max, Math.max(statInfo.min, stat.value))}
            stepSize={statInfo.integer ? 1 : 0.1}
            min={statInfo.min}
            max={statInfo.max}
            allowNumericCharactersOnly={true}
            onValueChange={(_v: number, value: string) =>
              handleStatChange(
                index,
                stat.stat,
                Math.min(
                  statInfo.max,
                  Math.max(
                    statInfo.min,
                    statInfo.integer ? Math.floor(_v) : _v,
                  ),
                ),
                stat.positive,
                stat.simpleAmount,
              )
            }
          />
        </FormGroup>
        <FormGroup label="Display">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              large={true}
              checked={stat.positive}
              innerLabel="Negative"
              innerLabelChecked="Positive"
              onChange={() =>
                handleStatChange(
                  index,
                  stat.stat,
                  stat.value,
                  !stat.positive,
                  stat.simpleAmount,
                )
              }
            />
            <HTMLSelect
              fill={true}
              options={[
                'notAssigned',
                'aLittleBitOf',
                'Some',
                'aLotOf',
                'aHugeAmountOf',
                'slightlyLower',
                'lower',
                'aLotLower',
                'slightlySmaller',
                'smaller',
              ]}
              value={stat.simpleAmount}
              onChange={(e) =>
                handleStatChange(
                  index,
                  stat.stat,
                  stat.value,
                  stat.positive,
                  e.target.value as SimpleAmount,
                )
              }
            />
          </div>
        </FormGroup>
        <Button
          intent={Intent.DANGER}
          text="Delete"
          fill={true}
          onClick={() => removeStat(index)}
        />
      </Card>
    );
  }

  return (
    <div
      className="fill-view"
      style={{
        margin: '0',
        padding: '0',
        display: 'grid',
        gridTemplateColumns: '35em 2fr',
        gridTemplateRows: '1fr',
      }}
    >
      <Card style={{ overflow: 'auto', paddingBottom: '10em' }}>
        <H1>
          <EditableText
            placeholder="Card Name"
            onChange={handleSetName}
            value={name}
          />
        </H1>
        <FormGroup label="Art Image URL" labelFor="card-art">
          <Tooltip
            fill
            content="To avoid unfavorable resizing in-game use images of dimension 512 x 402 pixels or of similar aspect ratio."
          >
            <InputGroup
              id="card-art"
              leftIcon={IconNames.DOWNLOAD}
              value={artUrl}
              placeholder="https://placehold.co/512x512/png"
              onChange={(e) => handleSetArtUrl(e.target.value)}
            />
          </Tooltip>
        </FormGroup>
        <FormGroup label="Description" labelFor="card-description">
          <TextArea
            aria-multiline={false}
            id="card-description"
            fill
            placeholder="Card Description"
            onChange={(e) => handleSetDescription(e.target.value)}
            value={description}
          />
        </FormGroup>

        <FormGroup label="Rarity" labelFor="card-rarity">
          <HTMLSelect
            fill={true}
            options={[
              'Trinket',
              'Common',
              'Scarce',
              'Uncommon',
              'Exotic',
              'Rare',
              'Epic',
              'Legendary',
              'Mythical',
              'Divine',
              'Unique',
              'Exordium',
            ]}
            value={rarity}
            id="card-rarity"
            onChange={(e) => handleSetRarity(e.target.value as CardRarity)}
          />
        </FormGroup>

        <FormGroup label="Color" labelFor="card-color">
          <HTMLSelect
            fill={true}
            options={[
              'DestructiveRed',
              'FirepowerYellow',
              'DefensiveBlue',
              'TechWhite',
              'EvilPurple',
              'PoisonGreen',
              'NatureBrown',
              'ColdBlue',
              'MagicPink',
            ]}
            value={color}
            id="open-ai-model"
            onChange={(e) => handleSetColor(e.target.value as CardColor)}
          />
        </FormGroup>
        {stats.map((s, i) => statView(i, s))}
        <Button
          style={{ marginTop: '1em' }}
          large={true}
          fill={true}
          intent={Intent.PRIMARY}
          onClick={addStat}
          text="Add Stat"
        />
      </Card>
      <SyntaxHighlighter
        customStyle={{
          overflow: 'auto',
          margin: 0,
          paddingTop: '1em',
          height: '100%',
        }}
        language="csharp"
        style={settings.theme == 'dark' ? dark : light}
      >
        {getCardScript()}
      </SyntaxHighlighter>
      <ButtonGroup style={{ position: 'absolute', bottom: 25, right: 25 }}>
        <Button
          large={true}
          icon={isValid() ? IconNames.SAVED : IconNames.DELETE}
          intent={isValid() ? Intent.SUCCESS : Intent.DANGER}
          text={isValid() ? 'Save & Exit' : 'Discard'}
          onClick={saveCard}
        />
        <Button
          disabled={!isValid()}
          icon={IconNames.CLIPBOARD}
          intent={Intent.PRIMARY}
          minimal={false}
          large
          onClick={copyCardScript}
          text="Copy Script"
        />
      </ButtonGroup>
    </div>
  );
}

export default CardBuilder;
