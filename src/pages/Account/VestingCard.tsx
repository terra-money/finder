import { ReactNode } from "react";
import Card from "../../components/Card";
import Flex from "../../components/Flex";
import Icon from "../../components/Icon";
import Pop from "../../components/Pop";
import s from "./TokenBalance.module.scss";

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`;

const VestingCard = ({ children }: { children: ReactNode }) => (
  <Card
    title={
      <Flex>
        Vesting&nbsp;
        <Pop
          tooltip={{
            content: TOOLTIP,
            contentStyle: { whiteSpace: "pre" }
          }}
        >
          <Icon name="info" className={s.icon} />
        </Pop>
      </Flex>
    }
    bordered
    headerClassName={s.cardTitle}
  >
    <div className={s.cardBodyContainer}>{children}</div>
  </Card>
);

export default VestingCard;
