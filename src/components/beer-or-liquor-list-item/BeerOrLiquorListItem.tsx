import {
  Box,
  ButtonDanger,
  ButtonInvisible,
  Dialog,
  Flex,
  Relative,
  SelectMenu,
  StyledOcticon,
  Text,
} from '@primer/components';
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from '@primer/octicons-react';
import React, { memo, useContext, useState } from 'react';
import {
  deleteBeerOrLiquor,
  markBeerOrLiquorInStock,
} from '../../utils/fetch-from-api';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import { Link } from 'react-router-dom';
import { LoggedInStatusContext } from '../../App';
import { displayErrorToast } from '../../utils/toast';
import styles from './BeerOrLiquorListItem.module.scss';
import toast from 'react-hot-toast';

function BeerOrLiquorListItem({
  beerOrLiquor,
}: {
  beerOrLiquor: BeerOrLiquorBrand;
}) {
  const { loggedIn } = useContext(LoggedInStatusContext);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const markInStock = React.useCallback(() => {
    const fn = async () => {
      try {
        await markBeerOrLiquorInStock(
          beerOrLiquor._id as unknown as string,
          !beerOrLiquor.inStock
        );
      } catch (e: any) {
        displayErrorToast(e.response.data);
      }
    };
    fn();
  }, [beerOrLiquor._id, beerOrLiquor.inStock]);

  const deleteRecord = React.useCallback(() => {
    const fn = async () => {
      try {
        await deleteBeerOrLiquor(beerOrLiquor._id as unknown as string);
        toast.success('Item deleted successfully.');
      } catch (e: any) {
        displayErrorToast(e.response.data);
      }
      setConfirmDelete(false);
    };
    fn();
  }, [beerOrLiquor._id]);
  return (
    <Flex alignItems='center' my={3} className={styles.root}>
      <Box flex={1}>
        <Flex alignItems='center'>
          <Text mr={1}>{beerOrLiquor.name}</Text>
        </Flex>
        <Text fontSize={0}>
          {beerOrLiquor.inStock ? (
            <React.Fragment>
              <StyledOcticon icon={CheckIcon} mr={1} color='icon.success' />
              In Stock
            </React.Fragment>
          ) : (
            <React.Fragment>
              <StyledOcticon icon={XIcon} mr={1} color='icon.danger' />
              Out of Stock
            </React.Fragment>
          )}
        </Text>
      </Box>
      {loggedIn && (
        <Relative display='flex' justifyContent='flex-end'>
          <SelectMenu>
            <ButtonInvisible as='summary'>Manage</ButtonInvisible>
            <SelectMenu.Modal align='right'>
              <SelectMenu.Header>{beerOrLiquor.name}</SelectMenu.Header>
              <SelectMenu.List>
                <SelectMenu.Item onClick={markInStock} as='button'>
                  {beerOrLiquor.inStock ? (
                    <React.Fragment>
                      <StyledOcticon icon={XIcon} mr={2} color='icon.danger' />
                      Mark as Out-of-Stock
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <StyledOcticon
                        icon={CheckIcon}
                        mr={2}
                        color='icon.success'
                      />
                      Mark as In-Stock
                    </React.Fragment>
                  )}
                </SelectMenu.Item>
                <Link to={`/beer-or-liquor?id=${beerOrLiquor._id}`}>
                  <SelectMenu.Item as='button'>
                    <StyledOcticon icon={PencilIcon} mr={2} color='icon.info' />
                    Edit
                  </SelectMenu.Item>
                </Link>
                <SelectMenu.Item
                  as='button'
                  onClick={() => setConfirmDelete(true)}
                >
                  <StyledOcticon icon={TrashIcon} mr={2} color='icon.danger' />
                  Delete
                </SelectMenu.Item>
              </SelectMenu.List>
            </SelectMenu.Modal>
          </SelectMenu>
          <Dialog
            isOpen={confirmDelete}
            onDismiss={() => setConfirmDelete(false)}
            className={styles.confirmDelete}
          >
            <Dialog.Header id='header-id'>Confirm Delete</Dialog.Header>
            <Box p={3} pb={0}>
              <Text letterSpacing={0.75}>
                Are you sure you'd like to delete {beerOrLiquor.name}? This will
                also delete any mixed drinks where {beerOrLiquor.name} is an
                ingredient.
              </Text>
            </Box>
            <Flex justifyContent='flex-end' p={3} pt={2}>
              <ButtonInvisible onClick={() => setConfirmDelete(false)}>
                Cancel
              </ButtonInvisible>
              <ButtonDanger onClick={deleteRecord}>Delete</ButtonDanger>
            </Flex>
          </Dialog>
        </Relative>
      )}
    </Flex>
  );
}

export default memo(BeerOrLiquorListItem);
