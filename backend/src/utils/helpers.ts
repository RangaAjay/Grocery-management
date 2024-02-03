import { BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { IOrderPayload } from 'types/common';

export const serializeProductPayload = (
  createOrderDto: CreateOrderDto,
): IOrderPayload[] => {
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
    return parsedArrayData;
  } else {
    throw new BadRequestException();
  }
};
