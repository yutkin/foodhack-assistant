import { StackNavigator } from 'react-navigation';

import RecipesList from './RecipesList';
import Recipe from './Recipe';
import InteractiveRecipe from './InteractiveRecipe';


export default StackNavigator({
  RecipesList: {
    screen: RecipesList,
  },
  Recipe: {
    screen: Recipe,
  },
  InteractiveRecipe: {
    screen: InteractiveRecipe,
  },
  initialRouteName: 'RecipesList',
});
