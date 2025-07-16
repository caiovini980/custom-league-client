import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import {
  ViewLootModal,
  ViewLootModalRef,
} from '@render/layouts/Loot/ViewLootModal';
import { ClientMakeRequestResponse } from '@shared/typings/ipc-function/handle/client.typing';
import { LolLootV1CraftMass } from '@shared/typings/lol/response/lolLootV1CraftMass';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
import { LolLootV1PlayerLoot_Id_ContextMenu } from '@shared/typings/lol/response/lolLootV1PlayerLoot_Id_ContextMenu';
import { LolLootV1RecipesInitialItem_Id } from '@shared/typings/lol/response/lolLootV1RecipesInitialItem_Id';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface LootContextProps {
  loots: LolLootV1PlayerLoot[];
}

export interface SlotData {
  lootId: string;
  name: string;
  img: string;
  amountRequired: number;
  amount: number;
}

interface LootContextState {
  isSlot: boolean;
  behaviorToSlot: (loot: LolLootV1PlayerLoot) => boolean;
  isAction: boolean;
  lootInSlots: SlotData[];
  setSlot: (
    loot: LolLootV1PlayerLoot,
    menu: LolLootV1PlayerLoot_Id_ContextMenu,
  ) => void;
  addLootInSlot: (loot: LolLootV1PlayerLoot) => void;
  removeLootInSlot: (lootId: string) => void;
  clearSlots: () => void;
  finishSlot: () => Promise<ClientMakeRequestResponse>;
  showLoots: (craft: LolLootV1CraftMass) => void;
  buttonLabel: string;
  buttonEnabled: boolean;
  description: string;
}

const Context = createContext({} as LootContextState);

export const useLootContext = () => useContext(Context);

export const LootContext = ({
  children,
  loots,
}: PropsWithChildren<LootContextProps>) => {
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();
  const { getLootImg, getLootName } = useLootUtil();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const viewLootRef = useRef<ViewLootModalRef>(null);

  const [isAction, setIsAction] = useState(false);
  const [menu, setMenu] = useState<LolLootV1PlayerLoot_Id_ContextMenu>();
  const [lootInSlots, setLootInSlots] = useState<LolLootV1PlayerLoot[]>([]);
  const [slotConfiguration, setSlotConfiguration] =
    useState<LolLootV1RecipesInitialItem_Id>();

  const getLootSlots = useMemo<SlotData[]>(() => {
    if (!slotConfiguration) return [];
    if (!lootInSlots.length) return [];
    const slotDataList: SlotData[] = [];

    slotConfiguration.slots.forEach((slot) => {
      const lootOp = lootInSlots.at(slot.slotNumber);
      if (lootOp && slot.lootIds.includes(lootOp.lootId)) {
        slotDataList.push({
          lootId: lootOp.lootId,
          name: getLootName(lootOp),
          img: getLootImg(lootOp),
          amount: lootOp.count >= slot.quantity ? slot.quantity : lootOp.count,
          amountRequired: slot.quantity,
        });
      } else if (slot.lootIds.length === 1) {
        const lootId = slot.lootIds[0];
        const loot = loots.find((l) => l.lootId === lootId);
        if (loot) {
          slotDataList.push({
            lootId: loot.lootId,
            name: getLootName(loot),
            amount: loot.count >= slot.quantity ? slot.quantity : loot.count,
            img: getLootImg(loot),
            amountRequired: slot.quantity,
          });
        }
      }
    });

    setLootInSlots(() =>
      loots.filter((lootSlot) =>
        slotDataList.some((l) => l.lootId === lootSlot.lootId),
      ),
    );

    return slotDataList;
  }, [
    slotConfiguration,
    lootInSlots.map((l) => l.lootId).join(':'),
    loots.map((l) => l.lootId).join(':'),
  ]);

  const setSlot = (
    loot: LolLootV1PlayerLoot,
    menu: LolLootV1PlayerLoot_Id_ContextMenu,
  ) => {
    clearSlots(0);
    makeRequest(
      'GET',
      buildEventUrl('/lol-loot/v1/recipes/initial-item/{id}', loot.lootId),
      undefined,
    ).then((res) => {
      if (res.ok) {
        const config = res.body.find((c) => c.type === menu.actionType);
        if (config) {
          setLootInSlots([loot]);
          setMenu(menu);
          setSlotConfiguration(config);
        }
      }
    });
  };

  const addLootInSlot = (loot: LolLootV1PlayerLoot) => {
    if (!slotConfiguration) return;
    if (slotConfiguration.slots.length <= lootInSlots.length) return;
    if (
      !slotConfiguration.slots.flatMap((s) => s.lootIds).includes(loot.lootId)
    )
      return;
    if (lootInSlots.some((l) => l.lootId === loot.lootId)) return;
    setLootInSlots((prev) => [...prev, loot]);
  };

  const removeLootInSlot = (lootId: string) => {
    setLootInSlots((prev) => prev.filter((l) => l.lootId !== lootId));
  };

  const clearSlots = (timeout = 300) => {
    setSlotConfiguration(undefined);
    setTimeout(() => {
      setLootInSlots([]);
      setMenu(undefined);
    }, timeout);
  };

  const finishSlot = () => {
    if (!menu || !getButtonEnabled()) {
      return Promise.resolve({ ok: true, status: 200, body: undefined });
    }
    setIsAction(true);
    const lootNames = lootInSlots.map((l) => l.lootId);
    return makeRequest('POST', '/lol-loot/v1/craft/mass', [
      {
        recipeName: menu.name,
        repeat: 1,
        lootNames,
      },
    ]).then((res) => {
      setIsAction(false);
      if (res.ok) {
        clearSlots(0);
        showLoots(res.body);
      }
      return res;
    });
  };

  const getButtonLabel = () => {
    if (!menu) return '';
    if (menu.actionType === 'OPEN') {
      return rcpFeLolLootTrans('loot_recipe_name_chest_generic_open');
    }
    if (menu.actionType === 'UPGRADE') {
      return rcpFeLolLootTrans('loot_recipe_name_champion_upgrade');
    }
    return rcpFeLolLootTrans(`loot_recipe_name_${menu.name.toLowerCase()}`);
  };

  const getDescription = () => {
    if (!menu) return '';
    return rcpFeLolLootTrans(
      `loot_recipe_requirement_${menu.name.toLowerCase()}`,
      menu.essenceQuantity,
    );
  };

  const showLoots = (craft: LolLootV1CraftMass) => {
    viewLootRef.current?.open(craft);
  };

  const behaviorToSlot = (loot: LolLootV1PlayerLoot) => {
    if (!slotConfiguration) return false;
    return slotConfiguration.slots
      .flatMap((s) => s.lootIds)
      .includes(loot.lootId);
  };

  const getButtonEnabled = () => {
    if (!slotConfiguration || isAction) return false;
    return slotConfiguration.slots.length === lootInSlots.length;
  };

  useEffect(() => {
    if (lootInSlots.length === 0) {
      clearSlots();
    }
  }, [lootInSlots.length]);

  return (
    <Context.Provider
      value={{
        isSlot: !!slotConfiguration,
        behaviorToSlot,
        isAction,
        lootInSlots: getLootSlots,
        addLootInSlot,
        clearSlots,
        removeLootInSlot,
        setSlot,
        finishSlot,
        showLoots,
        buttonLabel: getButtonLabel(),
        description: getDescription(),
        buttonEnabled: getButtonEnabled(),
      }}
    >
      {children}
      <ViewLootModal ref={viewLootRef} />
    </Context.Provider>
  );
};
