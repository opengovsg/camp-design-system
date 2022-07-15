import { RestrictedOgpLogoFull } from '~/icons/brand'
import { BxlFacebook } from '~/icons/BxlFacebook'
import { BxlInstagram } from '~/icons/BxlInstagram'
import { BxlLinkedin } from '~/icons/BxlLinkedin'

import { RestrictedFooterLinkWithIcon } from './types'

export const DEFAULT_FOOTER_ICON_LINK: RestrictedFooterLinkWithIcon = {
  href: 'https://open.gov.sg',
  label: 'Open Government Products homepage',
  Icon: RestrictedOgpLogoFull,
}

export const DEFAULT_SOCIAL_MEDIA_LINKS: RestrictedFooterLinkWithIcon[] = [
  {
    href: 'https://sg.linkedin.com/company/open-government-products',
    Icon: BxlLinkedin,
    label: 'Go to our LinkedIn page',
  },
  {
    href: 'https://www.facebook.com/opengovsg',
    Icon: BxlFacebook,
    label: 'Go to our Facebook page',
  },
  {
    href: 'https://www.instagram.com/opengovsg',
    Icon: BxlInstagram,
    label: 'Go to our Instagram page',
  },
]
