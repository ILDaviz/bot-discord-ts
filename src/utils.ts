import { IUser } from './api'

export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(min + Math.random() * (max - min + 1))
}
export const getUserString = (user: IUser): string => {
    return `<@${user.id}>`
}
export const getChannelString = (group_id: string): string => {
    return `<#${group_id}>`
}