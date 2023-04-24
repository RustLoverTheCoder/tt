import type { FC } from "react";
import React, { useState, memo, useCallback, useRef } from "react";

import type { ApiCountryCode } from "../../api/types";

import { ANIMATION_END_DELAY } from "../../config";
import { prepareSearchWordsForNeedle } from "../../util/searchWords";
import clsx from "clsx";
import renderText from "../common/helpers/renderText";
import useLang from "../../hooks/useLang";
import { isoToEmoji } from "../../util/emoji";
import useSyncEffect from "../../hooks/useSyncEffect";

import DropdownMenu from "../ui/DropdownMenu";
import MenuItem from "../ui/MenuItem";
import Spinner from "../ui/Spinner";

import "./CountryCodeInput.scss";
import { useAtom, useAtomValue } from "jotai";
import { phoneCodeListAtom } from "../../global";

type OwnProps = {
  id: string;
  value?: ApiCountryCode;
  isLoading?: boolean;
  onChange: (value: ApiCountryCode) => void;
};

const MENU_HIDING_DURATION = 200 + ANIMATION_END_DELAY;
const SELECT_TIMEOUT = 50;

const CountryCodeInput: FC<OwnProps> = ({ id, value, isLoading, onChange }) => {
  const phoneCodeList = useAtomValue(phoneCodeListAtom)
  const lang = useLang();
  // eslint-disable-next-line no-null/no-null
  const inputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState<string | undefined>();
  const [filteredList, setFilteredList] = useState<ApiCountryCode[]>([]);

  const updateFilter = useCallback(
    (filterValue?: string) => {
      setFilter(filterValue);
      setFilteredList(getFilteredList(phoneCodeList, filterValue));
    },
    [phoneCodeList]
  );

  useSyncEffect(
    ([prevPhoneCodeList]) => {
      if (!prevPhoneCodeList?.length && phoneCodeList.length) {
        setFilteredList(getFilteredList(phoneCodeList, filter));
      }
    },
    [phoneCodeList, filter]
  );

  const handleChange = useCallback(
    (country: ApiCountryCode) => {
      onChange(country);

      setTimeout(() => updateFilter(undefined), MENU_HIDING_DURATION);
    },
    [onChange, updateFilter]
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      updateFilter(e.currentTarget.value);
    },
    [updateFilter]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode !== 8) {
        return;
      }

      const target = e.currentTarget;
      if (value && filter === undefined) {
        target.value = "";
      }

      updateFilter(target.value);
    },
    [filter, updateFilter, value]
  );

  const CodeInput: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useCallback(
      ({ onTrigger, isOpen }) => {
        const handleTrigger = () => {
          if (isOpen) {
            return;
          }

          setTimeout(() => {
            inputRef.current!.select();
          }, SELECT_TIMEOUT);

          onTrigger();

          const formEl = document.getElementById("auth-phone-number-form")!;
          formEl.scrollTo({ top: formEl.scrollHeight, behavior: "smooth" });
        };

        const handleCodeInput = (e: React.FormEvent<HTMLInputElement>) => {
          handleInput(e);
          handleTrigger();
        };

        const inputValue = filter ?? (value?.name || value?.defaultName || "");

        return (
          <div className={clsx("input-group", value && "touched")}>
            <input
              ref={inputRef}
              className={clsx("form-control", isOpen && "focus")}
              type="text"
              id={id}
              value={inputValue}
              autoComplete="off"
              onClick={handleTrigger}
              onFocus={handleTrigger}
              onInput={handleCodeInput}
              onKeyDown={handleInputKeyDown}
            />
            <label>{lang("Login.SelectCountry.Title")}</label>
            {isLoading ? (
              <Spinner color="black" />
            ) : (
              <i
                onClick={handleTrigger}
                className={clsx("css-icon-down", isOpen && "open")}
              />
            )}
          </div>
        );
      },
      [filter, handleInput, handleInputKeyDown, id, isLoading, lang, value]
    );

  return (
    <DropdownMenu className="CountryCodeInput" trigger={CodeInput}>
      {filteredList.map((country: ApiCountryCode) => (
        <MenuItem
          key={`${country.iso2}-${country.countryCode}`}
          className={value && country.iso2 === value.iso2 ? "selected" : ""}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => handleChange(country)}
        >
          <span className="country-flag">
            {renderText(isoToEmoji(country.iso2), ["hq_emoji"])}
          </span>
          <span className="country-name">
            {country.name || country.defaultName}
          </span>
          <span className="country-code">+{country.countryCode}</span>
        </MenuItem>
      ))}
      {!filteredList.length && (
        <MenuItem key="no-results" className="no-results" disabled>
          <span>{lang("lng_country_none")}</span>
        </MenuItem>
      )}
    </DropdownMenu>
  );
};

function getFilteredList(
  countryList: ApiCountryCode[],
  filter = ""
): ApiCountryCode[] {
  if (!filter.length) {
    return countryList;
  }

  const searchWords = prepareSearchWordsForNeedle(filter);

  return countryList.filter(
    (country) =>
      searchWords(country.defaultName) ||
      (country.name && searchWords(country.name))
  );
}

export default memo(CountryCodeInput);
