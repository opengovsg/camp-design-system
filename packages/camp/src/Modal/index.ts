// v1 exposed a custom `ModalCloseButton` that defaulted to the BxX icon and
// `variant="clear" colorScheme="neutral"`. v3 uses `Dialog.CloseTrigger`
// natively. Re-export camp's `CloseButton` wrapper preserving the v1 default.
export {
  CloseButton as ModalCloseButton,
  type CloseButtonProps as ModalCloseButtonProps,
} from './ModalCloseButton'
