/*
 * Created on Wed Jul 20 2022
 *
 * Copyright (c) 2022 Smart DCC Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export function addPrefixToObject(prefix: string, o: unknown): unknown {
  if (typeof o === 'object') {
    if (Array.isArray(o)) {
      return o.map((x) => addPrefixToObject(prefix, x))
    } else {
      return Object.assign(
        {},
        ...Object.keys(o as Record<string | number, unknown>).map((k) => {
          const p = (o as Record<string, unknown>)[k]
          if (k.startsWith('@_') || k === '#text') {
            return { [k]: p }
          }
          return { [`${prefix}${k}`]: addPrefixToObject(prefix, p) }
        }),
      )
    }
  }
  return o
}
