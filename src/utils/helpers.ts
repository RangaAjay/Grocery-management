import { BadRequestException } from '@nestjs/common';
import { SingleOrderItem } from 'src/order/dto/create-order.dto';
import { IOrderPayload } from 'types/common';

export const serializeProductPayload = (
  createOrderDto: SingleOrderItem[],
): {
  parsedArrayData: IOrderPayload[];
  parsedOrderMap: Map<number, number>;
} => {
  const parsedOrderMap = new Map<number, number>();
  if (Array.isArray(createOrderDto)) {
    createOrderDto.forEach(
      (itm: { productId: number; productQuantity: number }) => {
        if (parsedOrderMap.has(itm.productId)) {
          parsedOrderMap.set(
            itm.productId,
            +parsedOrderMap.get(itm.productId)! + +itm.productQuantity,
          );
        } else {
          parsedOrderMap.set(itm.productId, +itm.productQuantity);
        }
      },
    );
    const parsedArrayData: IOrderPayload[] = [];
    parsedOrderMap.forEach((productQuantity, productId) => {
      parsedArrayData.push({ productId: +productId, productQuantity });
    });
    return { parsedArrayData, parsedOrderMap };
  } else {
    throw new BadRequestException();
  }
};
